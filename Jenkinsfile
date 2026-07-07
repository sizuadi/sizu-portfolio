pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'sizuwanoadi'
        IMAGE_NAME      = 'sizu-portfolio'
        VPS_HOST        = '202.10.41.110'
        VPS_USER        = 'root'
        VPS_DIR         = '/var/www/sizu-portfolio'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Ambil tag dari git
                    env.GIT_TAG = sh(
                        script: 'git describe --tags --exact-match 2>/dev/null || echo ""',
                        returnStdout: true
                    ).trim()

                    // Hanya lanjut jika ada tag
                    if (!env.GIT_TAG) {
                        currentBuild.result = 'NOT_BUILT'
                        error('Bukan push tag — skip build.')
                    }

                    env.IMAGE_TAG = env.GIT_TAG
                    echo "Building tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
                }
            }
        }

        stage('Build Images') {
            steps {
                sh """
                    docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}-frontend:${IMAGE_TAG} \
                        --target frontend .

                    docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}-backend:${IMAGE_TAG} \
                        ./backend

                    docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}-admin:${IMAGE_TAG} \
                        ./admin
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-frontend:${IMAGE_TAG}
                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-backend:${IMAGE_TAG}
                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-admin:${IMAGE_TAG}

                    # Tag juga sebagai latest
                    docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}-frontend:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}-frontend:latest
                    docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}-backend:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}-backend:latest
                    docker tag ${DOCKER_HUB_USER}/${IMAGE_NAME}-admin:${IMAGE_TAG} ${DOCKER_HUB_USER}/${IMAGE_NAME}-admin:latest

                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-frontend:latest
                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-backend:latest
                    docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}-admin:latest
                """
            }
        }

        stage('Deploy ke VPS') {
            steps {
                sshagent(credentials: ['vps-deploy-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                            'IMAGE_TAG=${IMAGE_TAG} bash ${VPS_DIR}/deploy.sh'
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deploy ${env.IMAGE_TAG} berhasil! sizu.dev updated."
        }
        failure {
            echo 'Build/deploy gagal. Cek log di atas.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}
