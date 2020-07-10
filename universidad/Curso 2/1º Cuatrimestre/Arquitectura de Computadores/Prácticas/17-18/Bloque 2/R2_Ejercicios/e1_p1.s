	.data 0

	.global x 
x: 	.double 3,2,1,4,8,9,2,7,4,5,3,2,8,4,5,3,2,6,4,5

	.text 256

;------------------------------------------------------------------------------
;	AUTHOR: Manuel Alférez Ruiz
;	
;	Cálculo del mínimo de 20 número de doble precisión en el registro F6
;
;	Número de ciclos en un procesador sin segmentar: 563 ciclos
;	Número de ciclos en un procesador segmentado: 
;		-Con bypass: 200 ciclos
;		-Sin bypass: 277 ciclos
;	Eliminar detenciones->Reordenando instrucciones
;		-Número de ciclos:
;		-Ganancia frente a procesador sin segmentar:
;		-Ganancia frente a procesador segmentado con bypass:
;------------------------------------------------------------------------------

addi	r1,r0,x		;IF+ID+EX+EX+WB=	4.8
addi	r2,r0,#19	;IF+ID+EX+EX+WB= 	4.8

ld	f6,0(r1)	;IF+ID+EX+MEM+WB= 	4.6
			;----------------------------
			;+=			14.2 ciclos		

;---------------------------------------------------------

minimo: 
addi	r1,r1,#8	;IF+ID+EX+EX+WB= 	4.8*19
ld	f0,0(r1)	;IF+ID+EX+MEM+WB= 	4.6*19
gtd	f6,f0		;IF+ID+EX= 		2.8*19
bfpt	cambia_minimo	;IF+ID+EX+MEM= 		3.8*19
subi	r2,r2,#1	;IF+ID+EX+EX+WB= 	4.8*17
beqz	r2,fin		;IF+ID+EX+MEM= 		3.8*17
j	minimo		;IF+ID+EX+MEM= 		3.8*17
			;----------------------------
			;+=			514.8 ciclos		

;---------------------------------------------------------

cambia_minimo: 
ld	f6,0(r1)	;IF+ID+EX+MEM+WB= 	4.6*2
subi	r2,r2,#1	;IF+ID+EX+EX+WB= 	4.8*2
beqz	r2,fin		;IF+ID+EX+MEM= 		3.8*2
j	minimo		;IF+ID+EX+MEM= 		3.8*2
			;-----------------------------
			;+=			34 ciclos

			;TOTAL= 		563 ciclos
;---------------------------------------------------------

fin: 	trap #0