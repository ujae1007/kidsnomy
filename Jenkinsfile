pipeline {
    agent any

    environment {
        GIT_CREDENTIALS = credentials('gitlab-token')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'gitlab-token', url: 'https://oauth2:${GIT_CREDENTIALS}@lab.ssafy.com/s12-fintech-finance-sub1/S12P21B207.git'
            }
        }

        stage('Stop Existing Containers') {
            steps {
                script {
                    def isRunning = sh(script: "docker ps -q", returnStdout: true).trim()
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
                sh 'docker-compose up -d'
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
