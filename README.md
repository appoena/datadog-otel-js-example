# datadog-otel-js-example

O objetivo desse projeto é demonstrar como unificar os spans gerados com a instrumentação automatica do Datadog com spans customizados gerados com opentelemetry.

## Pre requisitos para conseguir executar o projeto

- docker
- docker-compose

## Como rodar a aplicação

Configure a variavel de ambiente com a API Key da sua conta no Datadog:

```bash
export DD_API_KEY=YOUR_DATADOG_API_KEY
```

### Como subir a aplicação

```bash
docker-compose up -d --build --remove-orphans
```

### Como acessar a aplicação

No seu navegador basta acessar o endereço [http://localhost:3000](http://localhost:3000)

### Como derrubar a aplicação

```bash
docker-compose down --remove-orphans
```

## Como funciona?

O agent do Datadog é capaz de receber tanto os spans gerados pelas bibliotecas de spans do Datadog (dd-trace) como os spans gerados pelas bibliotecas do opentelemetry(otel). Esse funcionamento está detalhado no desenho abaixo

![desenho arquitetura](imgs/otlp_ingestion_datadog.png)

O agent do Datadog faz o merge entre os spans, garantindo que todos os spans sejam parte do mesmo trace.

Dessa forma é possível  aproveitar features que o Datadog oferece (ex.: AppSec, Data Streams Monitoring, Dynamic Instrumentation, etc...) e usar o otel para instrumentações customizadas, evitando o vendor lockin.

## O que é importante saber

Sobre o código da aplicação, os comentários em [node-api/index.js](node-api/index.js) explicam o que precisa ser feito.

A variável `DD_TRACE_OTEL_ENABLED` é obrigatória na aplicação para o correto funcionamento dessa estratégia, ela que "faz o merge" entre os traces do datadog e otel

Ainda na aplicação a variável `OTEL_EXPORTER_OTLP_ENDPOINT` define para onde os spans do otel serao enviados (datadog-agent)  

No agent, as variáveis `DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT` e `DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT` são obrigatórias, elas que dizem para o agent que ele deve receber dados gerados pelas libs do otel. Nao esquecer também de expor as portas para que a aplicaçao seja capaz de enviar os spans.

## Validando o funcionamento

Após subir a aplicaçao e acessar algumas vezes, será possível acessar os traces em APM > Traces no Datadog, basta filtrar por `service:node-api`

Ao abrir um trace esse deve ser o resultado:
![resultado](imgs/resultado.png)

Exemplo de erro(erro gerado de forma randômica, acesse algumas vezes para ter um exemplo):

![resultado com erro](imgs/resultado_erro.png)