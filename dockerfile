FROM apify/actor-node-puppeteer-chrome:16
COPY package.json ./
RUN echo "Installing dependencies..." && \
    npm install --save apify@^3.0.0 && \
    echo "Installing browser-use from GitHub..." && \
    npm install --save git+https://github.com/plugilode/browser-use#main || { echo "Failed to install browser-use"; exit 1; } && \
    echo "Dependencies installed."
COPY . ./
CMD npm start
