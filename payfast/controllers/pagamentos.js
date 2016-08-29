

module.exports = function(app){

  app.get("/pagamentos",function(req,res){
    res.send('Ok');
  });

  app.post("/pagamentos/pagamento",function(req,res){
    var pagamento = req.body;
    console.log('Processando pagamento...');

    var connection = app.persistencia.connectionFactory();


    var pagamentoDao = new app.persistencia.PagamentoDao(connection);

    pagamento.status = "CRIADO";
    pagamento.data = new Date;

    pagamentoDao.salva(pagamento,function(exception,result){
      console.log('Pagamento criado: '+ result);
      res.json(pagamento);
    });


  });
}
