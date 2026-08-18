import os
import re

# Resolve path to publish.yml
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKFLOW_PATH = os.path.join(BASE_DIR, ".github", "workflows", "publish.yml")

def test_workflow_exists():
    assert os.path.exists(WORKFLOW_PATH), "publish.yml workflow file is missing"

def test_workflow_trigger_and_permissions():
    with open(WORKFLOW_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    assert re.search(r"^\s*workflow_dispatch:\s*$", content, re.MULTILINE)
    for forbidden_trigger in ("push", "pull_request", "workflow_run", "schedule"):
        assert re.search(rf"^\s{{2}}{forbidden_trigger}:\s*$", content, re.MULTILINE) is None

    # OIDC Permissions check (id-token: write, contents: read)
    assert re.search(r'id-token:\s*write', content) is not None, "Workflow must request id-token write permissions for OIDC"
    assert re.search(r'contents:\s*read', content) is not None, "Workflow must request contents read permissions"

def test_npm_build_steps():
    with open(WORKFLOW_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Check for npm install and build commands
    assert "npm ci" in content, "Workflow must install dependencies via npm ci"
    assert "npm run build" in content, "Workflow must compile assets via npm run build"

def test_aws_oidc_setup_and_deploy():
    with open(WORKFLOW_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # AWS OIDC credentials check
    assert "aws-actions/configure-aws-credentials" in content, "Workflow must configure credentials using configure-aws-credentials"
    assert "role-to-assume" in content, "Workflow must specify role-to-assume input"

    # S3 sync check
    assert "aws s3 sync dist/" in content, "Workflow must sync static build assets to S3"

    # CloudFront invalidation check
    assert "aws cloudfront create-invalidation" in content, "Workflow must invalidate CloudFront distribution cache"

def test_no_deployment_commands_used():
    with open(WORKFLOW_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Ensure cluster isolation (no kubectl or helm)
    assert "kubectl" not in content, "Workflow must maintain isolation and not use kubectl"
    assert "helm" not in content, "Workflow must maintain isolation and not use helm"
