const PAGAMENTO_CRIADO = "CRIADO";
const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
const PAGAMENTO_CANCELADO = "CANCELADO";

module.exports = function(app){

  app.get("/pagamentos",function(req,res){
    res.send('Ok');
  });

  app.post("/pagamentos/pagamento",function(req,res){
    var body = req.body;
    var pagamento = body['pagamento'];

    req.assert("pagamento.forma_de_pagamento","Forma de Pagamento é obrigatoria.").notEmpty();
    req.assert("pagamento.valor","Valor é obrigatorio e deve ser um decimal").notEmpty().isFloat();
    req.assert("pagamento.moeda","Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

    var errors = req.validationErrors();
    if(errors){
      console.log("Erros de validação encontrados");
      res.status(400).send(errors);
      return;
    }

    console.log('Processando pagamento...');

    var connection = app.persistencia.connectionFactory();


    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamento.status = PAGAMENTO_CRIADO;
    pagamento.data = new Date;

    if(pagamento.forma_de_pagamento == 'cartao'){
      console.log('Pagamento com cartao');
      var cartoesClient = new app.servicos.CartoesClient();
      cartoesClient.autoriza(body['cartao'],function(err,request,response,retorno){
        if(err){
          console.log("Erro ao consultar serviço de cartões.");
          res.status(400).send(err);
          return;
        }
        console.log('Retorno do servico de cartões: %j',retorno);
        var	response	=	{
                    dados_do_pagamento:	pagamento,
                    cartao	:	retorno,
                    links:	[
                                    {
                                        href:	"http://localhost:3000/pagamentos/pagamento/"	+	pagamento.id,
                                        rel:	"confirmar",
                                        method:	"PUT"
                                    },
                                    {
                                        href:	"http://localhost:3000/pagamentos/pagamento/"	+	pagamento.id,
                                        rel:	"cancelar",
                                        method:	"DELETE"
                                    }
                                ]
                }
                res.status(201).json(response);
      });

    }else{

      pagamentoDao.salva(pagamento,function(exception,result){
        console.log('Pagamento criado: '+ result);

        res.location('/pagamentos/pagamento/'+ result.insertId);
        pagamento.id = result.insertId;

        var response = {
          dados_do_pagamento: pagamento,
          links: [
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                    rel:  "confirmar",
                    method: "PUT"
                  },
                  {
                    href: "http://localhost:3000/pagamentos/pagamento/"+ pagamento.id,
                    rel: "cancelar",
                    method: "DELETE"
                  }
                ]
        }

        res.status(201).json(pagamento);
      });


    }




  });


  app.put("/pagamentos/pagamento/:id", function(req,res){
      var pagamento = req.body;
      var id = req.params.id;

      var connection = app.persistencia.connectionFactory();

      var pagamentoDao = new app.persistencia.PagamentoDao(connection);

      pagamento.status = PAGAMENTO_CONFIRMADO;

      console.log('Before confirmarPagamento');

      pagamentoDao.alteraPagamento(pagamento.status,id, function(exception,result){
          if(exception){
            console.log('Erro'+ exception);
          }
          console.log('Pagamento confirmado');
          res.status(200).json(pagamento);
      });


  });


  app.delete("/pagamentos/pagamento/:id", function(req,res){
      var pagamento = req.body;
      var id = req.params.id;

      var connection = app.persistencia.connectionFactory();


      var pagamentoDao = new app.persistencia.PagamentoDao(connection);

      pagamento.status = PAGAMENTO_CANCELADO;

      console.log('Before cancelarPagamento');

      pagamentoDao.alteraPagamento(pagamento.status,id, function(exception,result){
          if(exception){
            console.log('Erro'+ exception);
          }
          console.log('Pagamento cancelado');
          res.status(200).json(pagamento);
      });


  });

}
