#!/bin/bash

# Essence Helm Chart Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
RELEASE_NAME="essence"
NAMESPACE="essence"
VALUES_FILE=""
DRY_RUN=false
UPGRADE=false

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -r, --release-name NAME    Release name (default: essence)"
    echo "  -n, --namespace NAME       Namespace (default: essence)"
    echo "  -f, --values FILE          Values file (e.g., values-production.yaml)"
    echo "  -d, --dry-run              Dry run mode"
    echo "  -u, --upgrade              Upgrade existing release"
    echo "  -h, --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Install with default values"
    echo "  $0 -f values-development.yaml        # Install with development values"
    echo "  $0 -f values-production.yaml -u      # Upgrade with production values"
    echo "  $0 -d -f values-production.yaml      # Dry run with production values"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -r|--release-name)
            RELEASE_NAME="$2"
            shift 2
            ;;
        -n|--namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        -f|--values)
            VALUES_FILE="$2"
            shift 2
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -u|--upgrade)
            UPGRADE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    print_error "Helm is not installed. Please install Helm first."
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if values file exists
if [[ -n "$VALUES_FILE" && ! -f "$VALUES_FILE" ]]; then
    print_error "Values file not found: $VALUES_FILE"
    exit 1
fi

# Build helm command
HELM_CMD="helm"
if [[ "$UPGRADE" == true ]]; then
    HELM_CMD="$HELM_CMD upgrade"
else
    HELM_CMD="$HELM_CMD install"
fi

HELM_CMD="$HELM_CMD $RELEASE_NAME ."

if [[ -n "$VALUES_FILE" ]]; then
    HELM_CMD="$HELM_CMD -f $VALUES_FILE"
fi

if [[ "$DRY_RUN" == true ]]; then
    HELM_CMD="$HELM_CMD --dry-run"
fi

HELM_CMD="$HELM_CMD --namespace $NAMESPACE --create-namespace"

# Execute deployment
print_status "Starting Essence deployment..."
print_status "Release name: $RELEASE_NAME"
print_status "Namespace: $NAMESPACE"
if [[ -n "$VALUES_FILE" ]]; then
    print_status "Values file: $VALUES_FILE"
fi
if [[ "$DRY_RUN" == true ]]; then
    print_status "Mode: Dry run"
fi
if [[ "$UPGRADE" == true ]]; then
    print_status "Mode: Upgrade"
fi

echo ""
print_status "Executing: $HELM_CMD"
echo ""

# Execute the command
if eval "$HELM_CMD"; then
    echo ""
    print_status "Deployment completed successfully!"
    
    if [[ "$DRY_RUN" != true ]]; then
        echo ""
        print_status "Checking deployment status..."
        kubectl get pods -n "$NAMESPACE"
        
        echo ""
        print_status "Checking services..."
        kubectl get services -n "$NAMESPACE"
        
        if [[ "$UPGRADE" != true ]]; then
            echo ""
            print_status "To view logs:"
            echo "  kubectl logs -f deployment/$RELEASE_NAME-backend -n $NAMESPACE"
            echo "  kubectl logs -f deployment/$RELEASE_NAME-frontend -n $NAMESPACE"
            echo "  kubectl logs -f deployment/$RELEASE_NAME-backend-db -n $NAMESPACE"
            
            echo ""
            print_status "To uninstall:"
            echo "  helm uninstall $RELEASE_NAME -n $NAMESPACE"
        fi
    fi
else
    print_error "Deployment failed!"
    exit 1
fi 