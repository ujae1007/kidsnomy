pipeline {
    agent any

    stages {
    //     stage('Clean Workspace') {
    //         steps {
    //             deleteDir()
    //         }
    //     }

        stage('Checkout Code') {
            steps {
                // 내장 checkout 단계를 사용합니다. Jenkins가 모든 것을 처리하도록 합니다.
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/release']], // 또는 '*/main' 등
                          extensions: [],
                          userRemoteConfigs: [[credentialsId: 'gitlab-token',
                                               url: 'https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21B207.git']]])
            }
        }

        stage('Copy Env Files') {
            steps {
                withCredentials([
                    file(credentialsId: 'env-rag-report', variable: 'ENV_RAG'),
                    file(credentialsId: 'env-java-application-properties', variable: 'ENV_JAVA')
                ]) {
                    sh '''
                        echo "📦 Setting permissions for existing env files..."
                        chmod +w "$WORKSPACE/.env" || true
                        chmod +w "$WORKSPACE/Backend/kidsnomy/src/main/resources/application-env.properties" || true

                        echo "🗑️ Removing old env files..."
                        rm -f "$WORKSPACE/.env"
                        rm -f "$WORKSPACE/Backend/kidsnomy/src/main/resources/application-env.properties"

                        echo "📦 Copying new env files..."
                        cp "$ENV_RAG" "$WORKSPACE/.env"
                        cp "$ENV_JAVA" "$WORKSPACE/Backend/kidsnomy/src/main/resources/application-env.properties"
                    '''
                }
            }
        }

        stage('Stop Existing Containers') {
            steps {
                script {
                    def isRunning = sh(script: "docker-compose ps -q", returnStdout: true).trim()
                    if (isRunning) {
                        sh "docker-compose down"
                        echo "Stopped running containers."
                    } else {
                        echo "No running containers found. Skipping docker-compose down."
                    }
                }
            }
        }

        stage('Build & Run Containers') {
            steps {
                sh '''
                    set -e
                    docker-compose pull
                    docker-compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}