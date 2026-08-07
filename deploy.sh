#!/bin/bash
# deploy.sh
# Usage: bash /home/cutee/deploy.sh [projectname]
# Example: bash /home/cutee/deploy.sh            # deploy everything
# Example: bash /home/cutee/deploy.sh admin       # deploy only admin

REPO_PATH="/home/cutee"
PROJECT=$1

declare -A BACKEND_DIRS=(
  [admin]="admin-backend"
  [agency]="agency-backend"
  [ferrywheel]="ferrywheel-backend"
  [host]="host-backend"
  [casino]="roulettecasino-backend"
  [tenpatii]="teenpatt-backend"
)

declare -A FRONTEND_DIRS=(
  [admin]="admin-frontend"
  [agency]="agency-frontend"
  [ferrywheel]="ferrywheel-frontend"
  [host]="host-frontend"
  [casino]="roulettecasino-frontend"
  [tenpatii]="teenpatti-frontend"
)

if [ -n "$PROJECT" ] && [ -z "${BACKEND_DIRS[$PROJECT]}" ]; then
  echo "❌ Unknown project: $PROJECT"
  echo "Valid options: ${!BACKEND_DIRS[@]}"
  exit 1
fi

cd "$REPO_PATH" || { echo "❌ Repo not found at $REPO_PATH"; exit 1; }

echo "📦 Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main

PROJECTS_TO_DEPLOY=("${!BACKEND_DIRS[@]}")
if [ -n "$PROJECT" ]; then
  PROJECTS_TO_DEPLOY=("$PROJECT")
fi

for p in "${PROJECTS_TO_DEPLOY[@]}"; do
  BACKEND_DIR="${BACKEND_DIRS[$p]}"
  FRONTEND_DIR="${FRONTEND_DIRS[$p]}"

  echo "🚀 Deploying $p ($BACKEND_DIR)..."

  cd "$REPO_PATH/$BACKEND_DIR" || { echo "❌ $BACKEND_DIR not found, skipping $p"; continue; }
  echo "📦 Installing backend dependencies for $p..."
  npm install --legacy-peer-deps

  if [ -d "$REPO_PATH/$FRONTEND_DIR" ]; then
    cd "$REPO_PATH/$FRONTEND_DIR" || continue
    echo "🧱 Building frontend for $p..."
    npm install --legacy-peer-deps
    npm run build

    echo "📂 Copying frontend build into $BACKEND_DIR/public..."
    rm -rf "$REPO_PATH/$BACKEND_DIR/public"
    cp -r build "$REPO_PATH/$BACKEND_DIR/public"
  fi

  cd "$REPO_PATH"
  if pm2 list | grep -q "$p"; then
    echo "♻️ Restarting $p with PM2..."
    pm2 restart "$p" --update-env
  else
    echo "🚀 Starting $p with PM2..."
    pm2 start ecosystem.config.js --only "$p"
  fi
done

echo "✅ Deployment complete."
