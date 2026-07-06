pipeline {
    agent any

    environment {
        VPS_HOST = '202.10.41.110'
        VPS_USER = 'root'
        VPS_DIR  = '/var/www/sizu-portfolio'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sizuadi/sizu-portfolio.git'
            }
        }

        stage('Deploy to VPS') {
            steps {
                sshagent(credentials: ['vps-deploy-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \
                            'bash ${VPS_DIR}/deploy.sh'
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy berhasil! sizu.dev updated.'
        }
        failure {
            echo 'Deploy gagal. Cek log di atas.'
        }
    }
}
