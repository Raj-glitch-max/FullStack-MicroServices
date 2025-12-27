#!/usr/bin/env python3
"""Validate GitOps manifests in this repo.

Goals:
- Parse YAML for basic correctness (no schema/CRD validation)
- Render Kustomize overlays if supported:
  - Prefer `kubectl kustomize` (works on many kubectl versions)
  - Fall back to `kustomize build` if installed

Exit codes:
- 0: success
- 1: validation failed
"""

from __future__ import annotations

import argparse
import glob
import os
import subprocess
import sys
from typing import Iterable


def eprint(*args: object) -> None:
    print(*args, file=sys.stderr)


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)


def which(bin_name: str) -> str | None:
    for p in os.environ.get("PATH", "").split(os.pathsep):
        cand = os.path.join(p, bin_name)
        if os.path.isfile(cand) and os.access(cand, os.X_OK):
            return cand
    return None


def find_kubectl() -> str | None:
    """Return a usable kubectl path.

    Some environments have kubectl available but PATH detection can be brittle
    (shell/venv wrappers). We try PATH first, then fall back to invoking
    `kubectl` directly and trusting the OS resolver.
    """

    p = which("kubectl")
    if p:
        return p
    # Fallback: try invoking `kubectl` as-is.
    try:
        r = subprocess.run(
            ["kubectl", "version", "--client"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        if r.returncode == 0:
            return "kubectl"
    except Exception:
        pass
    return None


def iter_yaml_files() -> Iterable[str]:
    patterns = [
        "argocd/**/*.yaml",
        "k8s-manifests/**/*.yaml",
        "eks/**/*.yaml",
        # keep `k8s/` out by default (it's local-learning and can include CRD-ish experiments)
    ]
    for pat in patterns:
        for p in glob.glob(pat, recursive=True):
            if os.path.isfile(p):
                yield p


def parse_yaml(files: list[str]) -> list[tuple[str, str]]:
    try:
        import yaml  # type: ignore
    except Exception:
        return [("PyYAML missing", "Install with: pip install pyyaml")]

    failed: list[tuple[str, str]] = []
    for p in sorted(files):
        try:
            with open(p, "r", encoding="utf-8") as f:
                list(yaml.safe_load_all(f))
        except Exception as e:
            failed.append((p, str(e)))
    return failed


def render_overlay(overlay_path: str) -> tuple[bool, str]:
    overlay_path = overlay_path.rstrip("/")

    kubectl = find_kubectl()
    kustomize = which("kustomize")

    if kubectl:
        r = run([kubectl, "kustomize", overlay_path])
        if r.returncode == 0:
            return True, r.stdout
        # If kubectl exists but doesn't support kustomize, fall through to kustomize binary.
        # Keep stderr around — it's often helpful.
        kubectl_err = r.stderr.strip()
        if kubectl_err:
            eprint(f"kubectl kustomize error (ignored, will try kustomize): {kubectl_err}")

    if kustomize:
        r = run([kustomize, "build", overlay_path])
        if r.returncode == 0:
            return True, r.stdout
        return False, r.stderr.strip() or "kustomize build failed"

    return False, "Neither `kubectl kustomize` nor `kustomize` is available in PATH."


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--overlay",
        action="append",
        default=["k8s-manifests/overlays/prod"],
        help="Overlay(s) to render (default: k8s-manifests/overlays/prod)",
    )
    args = ap.parse_args()

    files = list(iter_yaml_files())
    yaml_fail = parse_yaml(files)
    if yaml_fail:
        eprint("YAML parse FAIL")
        for p, err in yaml_fail:
            eprint(f"- {p}: {err}")
        return 1

    print(f"YAML parse PASS: {len(files)} files")

    for overlay in args.overlay:
        ok, out = render_overlay(overlay)
        if not ok:
            eprint(f"Kustomize render FAIL: {overlay}\n{out}")
            return 1
        # Basic sanity: ensure output contains at least one Kubernetes object.
        if "apiVersion:" not in out or "kind:" not in out:
            eprint(f"Kustomize render FAIL: {overlay} produced no objects")
            return 1
        print(f"Kustomize render PASS: {overlay} ({len(out.splitlines())} lines)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
