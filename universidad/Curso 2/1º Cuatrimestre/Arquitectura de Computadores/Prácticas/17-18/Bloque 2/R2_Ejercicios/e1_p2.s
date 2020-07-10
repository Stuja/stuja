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
;		-Número de ciclos: 148 ciclos
;		-Ganancia frente a procesador sin segmentar: 415 ciclos
;		-Ganancia frente a procesador segmentado con bypass: 52 ciclos
;------------------------------------------------------------------------------

addi	r1,r0,x		
addi	r2,r0,#19	

ld	f6,0(r1)	
			
;---------------------------------------------------------

minimo: 
addi	r1,r1,#8	
ld	f0,0(r1)
subi	r2,r2,#1	
gtd	f6,f0		
bfpt	cambia_minimo	
beqz	r2,fin		
j	minimo		
			
					

;---------------------------------------------------------

cambia_minimo: 
subi	r2,r2,#1
ld	f6,0(r1)	
beqz	r2,fin		
j	minimo		

;---------------------------------------------------------

fin: 	trap #0