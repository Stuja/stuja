ALTER USER GI101 IDENTIFIED BY v84sgd;

/*1*/
CREATE TABLE nadador(
cn     NUMBER(3)    CONSTRAINT pk_nadador        PRIMARY KEY,
nombre VARCHAR(10)  CONSTRAINT nn_nombre_nadador NOT NULL,
f_nac  DATE         CONSTRAINT nn_f_nac_nadador  NOT NULL,
sexo   VARCHAR(1)   CONSTRAINT ck_sexo_nadador   CHECK (sexo = 'F' OR sexo = 'M'),
esp    VARCHAR(3)   CONSTRAINT ck_esp_nadador    CHECK (esp IN ('BRA','LIB','MAR','ESP'))
                    );
                    
CREATE TABLE entreno(
ce       VARCHAR(3)   CONSTRAINT pk_entreno           PRIMARY KEY,
estilo   VARCHAR(3)   CONSTRAINT ck_estilo_entreno    CHECK (estilo IN ('BRA','LIB','MAR','ESP')) 
                      CONSTRAINT nn_estilo_entreno    NOT NULL,
metros   NUMBER(3)    CONSTRAINT ck_metros_entreno    CHECK (metros >=50 AND metros <=400)
                      CONSTRAINT nn_metros_entreno    NOT NULL,
t_max    NUMBER(3)
                    );
                    
CREATE TABLE sesion(
cn       NUMBER(3),
ce       VARCHAR(3)   CONSTRAINT fk_ce_sesion        REFERENCES entreno,
tiempo   NUMBER(3)
                    );
                    
SELECT table_name FROM user_tables; 
/*2.1*/
ALTER TABLE sesion ADD(fecha DATE);
/*2.2*/
ALTER TABLE sesion MODIFY(fecha DATE CONSTRAINT nn_fecha_sesion NOT NULL);
/*2.3*/
ALTER TABLE sesion MODIFY(cn NUMBER(3) CONSTRAINT fk_cn_sesion REFERENCES nadador);
/*2.4*/
ALTER TABLE sesion ADD( CONSTRAINT pk_sesion PRIMARY KEY(cn,ce,fecha) );

/*3*/
INSERT INTO nadador VALUES(111,'MARIA','10-ENE-1987','F','BRA');
INSERT INTO nadador VALUES(222,'JUAN','4-MAR-1990','M', NULL);
INSERT INTO nadador VALUES(333,'ANA','25-ENE-1990','F', NULL);
INSERT INTO nadador VALUES(444,'ANDRES','2-JUN-1989','M','MAR');

INSERT INTO entreno VALUES('L05','LIB',50,90);
INSERT INTO entreno VALUES('L10','LIB',100,200);
INSERT INTO entreno VALUES('B10','BRA',100,240);
INSERT INTO entreno VALUES('M10','MAR',100,220);

INSERT INTO sesion VALUES(111,'L10',85,'17-FEB-2011');
INSERT INTO sesion VALUES(222,'B10',102,'17-FEB-2011');
INSERT INTO sesion VALUES(333,'L05',42,'17-FEB-2011');
INSERT INTO sesion VALUES(444,'M10',81,'17-FEB-2011');
INSERT INTO sesion VALUES(333,'L05',45,'10-MAR-2011');
INSERT INTO sesion VALUES(444,'M10',75,'10-MAR-2011');
INSERT INTO sesion VALUES(333,'L05',39,'17-MAR-2011');
INSERT INTO sesion VALUES(444,'M10',75,'17-MAR-2011');

/*4.1*/
UPDATE sesion
SET fecha= fecha+1
WHERE fecha='10-MAR-2011';

/*4.2*/
DELETE FROM nadador
WHERE cn= '111';

/*4.3*/
UPDATE entreno
SET t_max= t_max-5
WHERE metros=100;

/*4.4*/
INSERT INTO sesion VALUES(111,'B20', 159,'10-FEB-2011'); /*No se puede introducir la tupla porque viola una restriccion de clave foránea*/
INSERT INTO sesion VALUES(111,'L10', 89,'17-FEB-2011');

/*5*/
SELECT * FROM nadador ORDER BY 1;
SELECT * FROM entreno ORDER BY 1;
SELECT * FROM sesion ORDER BY 1,2,3,4;

DELETE FROM sesion;
DROP TABLE entreno CASCADE CONSTRAINT;
DROP TABLE nadador CASCADE CONSTRAINT;
DROP TABLE sesion CASCADE CONSTRAINT;
