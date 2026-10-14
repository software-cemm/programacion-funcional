FROM haskell:9.6

# La imagen completa (basada en buildpack-deps) ya incluye gcc,
# build-essential y libpq-dev: no se requiere apt-get.
WORKDIR /app

# Copiamos primero el manifiesto para cachear la capa de dependencias
COPY app.cabal ./
RUN cabal update && cabal build --only-dependencies -j4

COPY . .
RUN cabal build

EXPOSE 3000
CMD ["cabal", "run", "servidor-funcional"]
