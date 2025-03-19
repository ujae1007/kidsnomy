pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'gitlab-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    sh '''
                        set -e
                        if [ -d "repo/.git" ]; then
                            cd repo
                            git pull
                        else
                            rm -rf repo
                            git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@lab.ssafy.com/s12-fintech-finance-sub1/S12P21B207.git repo
                        fi
                        ls -la
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
