# FROM node:latest as node
# # RUN mkdir -p /src
# WORKDIR /src
# COPY /package.json /src
# RUN npm install
# # COPY . /src
# # COPY . .
# # RUN npm run build --prod
# CMD npm start

# # FROM nginx
# # COPY ./ /usr/share/nginx/html
# # EXPOSE 80

#stage 1
FROM node:16.13.1 as node
WORKDIR /src
COPY /package.json /src
RUN npm install
# RUN npm run build --prod
CMD npm start

# #stage 2
FROM nginx
COPY --from=node /app/dist/demo-app /usr/share/nginx/html