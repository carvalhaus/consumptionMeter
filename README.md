# consumptionMeter

Back-end de um serviço que gerencia a leitura individualizada de consumo de água e gás. Para facilitar a coleta da informação, o serviço utilizará IA para obter a medição através da foto de um medidor.

## Endpoints

### POST /upload
Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API.

- [x] Validar o tipo de dados dos parâmetros enviados (inclusive o base64);
- [x] Verificar se já existe uma leitura no mês naquele tipo de leitura;
- [x] Integrar com uma API de LLM para extrair o valor da imagem;
- [ ] Retornar um link temporário para a imagem;
- [x] Retornar um GUID;
- [x] Retornar o valor numérico reconhecido pela LLM.

### PATCH /confirm
Responsável por confirmar ou corrigir o valor lido pelo LLM:
 
- [ ] Validar o tipo de dados dos parâmetros enviados;
- [ ] Verificar se o código de leitura informado existe;
- [ ] Verificar se o código de leitura já foi confirmado;
- [ ] Salvar no banco de dados o novo valor informado;
- [ ] NÃO deve fazer novas consultas ao LLM para validar o novo resultado recebido;
- [ ] Retornar resposta de OK ou ERRO dependendo do valor informado.

### GET /<customer code>/list
Responsável por listar as medidas realizadas por um determinado cliente.

- [ ] Receber o código do cliente e filtrar as medidas realizadas por ele;
- [ ]  opcionalmente pode receber um query parameter “measure_type”, que deve ser “WATER” ou “GAS” (- A validação deve ser CASE INSENSITIVE; - Se o parâmetro for informado, filtrar apenas os valores do tipo especificado. Senão, retornar todos os tipos. Ex. {base url}/<customer code>/list?measure_type=WATER);
- [ ] Retornar uma lista com todas as leituras realizadas.
