FROM node
WORKDIR /app
COPY package.json .
RUN npi i
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]