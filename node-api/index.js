//importa as libs do otel e inicia o sdk
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {OTLPTraceExporter} = require('@opentelemetry/exporter-trace-otlp-proto');
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter()
});
sdk.start();

//obtem o tracer, necessario para a instrumentaçao customizada
const { trace, SpanStatusCode } = require('@opentelemetry/api');
const tracer = trace.getTracer();

const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  var order_id
  // como criar custom spans
  tracer.startActiveSpan('otel_custom_span', (span) => {  
    //como configurar atributos
    span.setAttribute('custom_attribute','appoena-otel-datadog');
    axios.get('https://httpbin.org/uuid')
      .then(response => {
        if (Math.random() > 0.2){
          order_id = response.data;
          span.setAttribute('order_id',order_id.uuid);
          res.send(`Order id: ${order_id.uuid}`)
          span.end();
        }
        else{
          throw new Error('Error generated on purpose');
        }      
      })
      .catch(err => {
        //como configurar erro, importante para uma correta visualizaçao na ferramenta
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR })
        res.send('Sorry, check your traces and try again :)') 
        res.status(500)
        span.end(); 
      });
  });

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})