

module.exports = function(app){

  app.get("/pagamentos",function(req,res){
    res.send('Ok');
  });

  app.post("/pagamentos/pagamento",function(req,res){
    var pagamento = req.body;

    req.assert("forma_de_pagamento","Forma de Pagamento é obrigatoria.").notEmpty();
    req.assert("valor","Valor é obrigatorio e deve ser um decimal").notEmpty().isFloat();
    req.assert("moeda","Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

    var errors = req.validationErrors();
    if(errors){
      console.log("Erros de validação encontrados");
      res.status(400).send(errors);
      return;
    }

    console.log('Processando pagamento...');

    var connection = app.persistencia.connectionFactory();


    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamento.status = "CRIADO";
    pagamento.data = new Date;

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


  });
}
