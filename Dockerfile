FROM denoland/deno:2.0.6

WORKDIR /app
USER deno

ENV LOG_INTERVAL=500
ENV LOG_INTERVAL_RANDOM_OFFSET=5000

COPY . .
RUN deno cache main.ts

CMD ["run", "--allow-env", "main.ts"]
