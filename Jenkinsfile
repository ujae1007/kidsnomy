pipeline {
    agent any

    stages {
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