    	.data 0

	    .global vect
vect:	.double 10,9,8,10,2,5,7,8,5,4,1,10

	    .global num
num:	.word 12

	    .global val
val:	.double 10

	    .text 256	

;----------------------------------------------------
;       AUTHOR: Manuel Alférez Ruiz
;       FILE:   reordenado.s
;----------------------------------------------------

addi	r1,r0,vect
lw	    r2,num
ld	    f0,val


bucle:
ld	    f2,0(r1)
subi	r2,r2,#1
eqd	    f0,f2
bfpf	no_iguales
addi	r7,r7,#1
no_iguales:
addi	r1,r1,#8
bnez	r2,bucle

trap #0
