FROM node:21-alpine3.17 as build
WORKDIR /FrontEnd
ENV PATH /FrontEnd/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
COPY . ./
RUN npm run build

FROM nginx:1.21.3-alpine as final
COPY --from=build /FrontEnd/dist /usr/share/nginx/html
EXPOSE 8005
CMD ["nginx", "-g", "daemon off;"]