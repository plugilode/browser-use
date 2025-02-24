FROM apify/actor-node-puppeteer-chrome:18
COPY package.json ./
RUN echo "Installing dependencies..." && \
    npm install --save apify@^3.0.0 && \
    echo "Installing browser-use from GitHub..." && \
    npm install --save git+https://github.com/browser-use/browser-use.git#main && \
    echo "Dependencies installed."
COPY . ./
CMD npm start
