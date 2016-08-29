  CREATE TABLE `pagamentos` (
  	`id` int(11) NOT NULL AUTO_INCREMENT,
 	`forma_de_pagamento` varchar(255) NOT NULL,
 	`valor` decimal(10,2) NOT NULL,
 	`moeda` varchar(3) NOT NULL,
 	`status` varchar(255) NOT NULL,
 	`data` DATE,
 	`descricao` text,
 	 PRIMARY KEY (id)
 	);