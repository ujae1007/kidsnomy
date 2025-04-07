#!/bin/bash

# .env 파일 로드
set -o allexport
source ./.env
set +o allexport

# --- 설정 (환경 변수에서 읽어옴) ---
IMAGE_NAME_PREFIX="${IMAGE_NAME:-kwon0528}" # 기본 이미지 이름 접두사
REGISTRY_USERNAME="${REGISTRY_USERNAME}"
REGISTRY_PASSWORD="${REGISTRY_PASSWORD}"
REGISTRY_URL="${REGISTRY_URL:-docker.io}" # 기본 레지스트리 URL

# --- Git 태그 기반 버전 설정 ---
GIT_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
echo "Latest Git tag: ${GIT_TAG}"
if [[ "$GIT_TAG" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9._-]+)*(\+[a-zA-Z0-9._-]+)*$ ]]; then
    TAG="$GIT_TAG"
    TAG="${TAG#v}"
else
    echo "Warning: No valid SemVer tag found. Using 'latest' tag."
    TAG="latest"
fi

# --- Docker 레지스트리 로그인 ---
echo "Logging in to Docker registry: ${REGISTRY_URL}"
echo "$REGISTRY_PASSWORD" | docker login -u "${REGISTRY_USERNAME}" --password-stdin "${REGISTRY_URL}"

if [ $? -ne 0 ]; then
    echo "Docker registry login failed."
    exit 1
fi

# --- 각 서비스별 이미지 빌드 및 푸시 ---

# react-app
echo "--- Building and pushing react-app ---"
REACT_APP_IMAGE="${IMAGE_NAME_PREFIX}-react-app:${TAG}"
docker build -t "${REACT_APP_IMAGE}" ./Frontend
if [ $? -eq 0 ]; then
    docker push "${REACT_APP_IMAGE}"
else
    echo "Error building react-app"
fi

REACT_APP_IMAGE_LATEST="${IMAGE_NAME_PREFIX}-react-app:latest"
docker build -t "${REACT_APP_IMAGE_LATEST}" ./Frontend
if [ $? -eq 0 ]; then
    docker push "${REACT_APP_IMAGE_LATEST}"
else
    echo "Error building react-app"
fi

echo ""

# java-app
echo "--- Building and pushing java-app ---"
JAVA_APP_IMAGE="${IMAGE_NAME_PREFIX}-java-app:${TAG}"
docker build -t "${JAVA_APP_IMAGE}" ./Backend --build-arg SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL}" --build-arg SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME}" --build-arg SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD}"
if [ $? -eq 0 ]; then
    docker push "${JAVA_APP_IMAGE}"
else
    echo "Error building java-app"
fi

JAVA_APP_IMAGE_LATEST="${IMAGE_NAME_PREFIX}-java-app:latest"
docker build -t "${JAVA_APP_IMAGE_LATEST}" ./Backend --build-arg SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL}" --build-arg SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME}" --build-arg SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD}"
if [ $? -eq 0 ]; then
    docker push "${JAVA_APP_IMAGE_LATEST}"
else
    echo "Error building java-app"
fi

echo ""

# fastapi-app
echo "--- Building and pushing fastapi-app ---"
FASTAPI_APP_IMAGE="${IMAGE_NAME_PREFIX}-fastapi-app:${TAG}"
docker build -t "${FASTAPI_APP_IMAGE}" ./AI
if [ $? -eq 0 ]; then
    docker push "${FASTAPI_APP_IMAGE}"
else
    echo "Error building fastapi-app"
fi

FASTAPI_APP_IMAGE_LATEST="${IMAGE_NAME_PREFIX}-fastapi-app:latest"
docker build -t "${FASTAPI_APP_IMAGE_LATEST}" ./AI
if [ $? -eq 0 ]; then
    docker push "${FASTAPI_APP_IMAGE_LATEST}"
else
    echo "Error building fastapi-app"
fi

echo ""

# mysql
echo "--- Building and pushing mysql ---"
MYSQL_IMAGE="${IMAGE_NAME_PREFIX}-mysql:${TAG}"
docker build -t "${MYSQL_IMAGE}" ./DB --build-arg MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD}" --build-arg MYSQL_DATABASE="${MYSQL_DATABASE}" --build-arg MYSQL_USER="${MYSQL_USER}" --build-arg MYSQL_PASSWORD="${MYSQL_PASSWORD}"
if [ $? -eq 0 ]; then
    docker push "${MYSQL_IMAGE}"
else
    echo "Error building mysql"
fi

MYSQL_IMAGE_LATEST="${IMAGE_NAME_PREFIX}-mysql:latest"
docker build -t "${MYSQL_IMAGE_LATEST}" ./DB --build-arg MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD}" --build-arg MYSQL_DATABASE="${MYSQL_DATABASE}" --build-arg MYSQL_USER="${MYSQL_USER}" --build-arg MYSQL_PASSWORD="${MYSQL_PASSWORD}"
if [ $? -eq 0 ]; then
    docker push "${MYSQL_IMAGE_LATEST}"
else
    echo "Error building mysql"
fi

echo ""

echo "All specified images built and push process initiated."

exit 0