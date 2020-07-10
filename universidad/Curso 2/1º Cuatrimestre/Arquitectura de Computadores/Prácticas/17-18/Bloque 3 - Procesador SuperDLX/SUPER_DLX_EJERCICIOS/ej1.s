	.data 1000

	.global v
v:	.double 1.1, 5.6, 5, 6, 8, 7, 9, 1, 3, 4, 55, 88, 66, 4, 19, 2, 5, 63, 0, 0.3, 87, 1, 87, 24, 65, 12, 34, 85, 61, 5

	.global numEle
numEle:	.word 29

	.text 100

;-----------------------------------------------------

addi 	r1,r0,v		;R1->Puntero
addi	r2,r0,v		;R2->Puntero del menor
lw	r3,numEle	;R3->Número de elementos
lw	r4,numEle

busca_minimo:
ld	f0,0(r2)
addi 	r1,r1,#8
ld	f2,0(r1)
gtd	f0,f2
bfpt	cambia_menor
cambia_menor:
ld	f0,0(r1)
subi	r3,r3,#1
bnez	r3,busca_minimo

siguiente:
addi	r2,r2,#8
add	r1,r0,r2
subi	r4,r4,#1
bnez	busca_minimo

trap #0
