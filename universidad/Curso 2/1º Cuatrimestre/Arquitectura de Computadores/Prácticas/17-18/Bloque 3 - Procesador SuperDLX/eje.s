	.data 0

	.global v
v:	.double 1,2,3,4,5,6,7,8,9,10,2,5,6,4,7,8,9,3,1,4,6,11,4,5,7,9,8,4,6,10

	.global i
i:	.word 29
	.global j
j:	.word 29

	.text 256

;----------------------------------------------------

add	r1,r0,v		;Puntero al menor
add 	r2,r0,v		;Puntero para recorrer el vector

add	r3,r0,i		
lw	r4,0(r3)	;Contador i=2
add	r3,r0,j
lw	r5,0(r3)	;Contador j=2

;----------------------------------------------------

bucle1:
ld	f0,0(r1)	;Cargo en f0->el valor del puntero r1

addi	r2,r1,#8	;R2-> Apunta al r1 (modificado anteriormente)


beqz	r4,fin		;Comprobamos si es cero

add	r6,r5,r0	;Para ir decrementando r6

bucle2:
ld	f2,0(r2)	;Cargamos en f2-> el valor del puntero r2
subi	r6,r6,#1	;Decrementamos j
gtd	f0,f2		;f0>f2-> 1 (hay que cambiar valores)
bfpf	no_cambia
sd	0(r1),f2	;Almacenamos f2->donde apunta r1
sd 	0(r2),f0	;Almacenamos f0->donde apunta r2
ld	f0,0(r1)
no_cambia:
beqz	r6,decrementa	;Fin de bucle de j
addi	r2,r2,#8	;Apuntamos al siguiente dato
j	bucle2

decrementa:
subi	r5,r5,#1	;Decrementamos el contador j en uno
subi	r4,r4,#1	;Decrementamos contador i
addi	r1,r1,#8	;Apunto al siguiente dato r1
j	bucle1

fin:	trap #0