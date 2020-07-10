#ifdef _OPENMP
    #include <omp.h>
    #define OMP_NUM_THREADS = 4;
#else
    #define omp_get_thread_num() 0
#endif
#include <stdio.h>
#include <stdlib.h>
#define M 4
#define N 15
#define P 15

int main(int argc, char *argv[]) {
    //Declaración de variables y matrices
    int i,j,k;
    int tid;
    int mat1[M][N];
    int mat2[N][P];
    int mat3[M][P];

    //Inicializamos la mat1
    for (i = 0; i < M; i++)
        for (j = 0; j < N; j++)
            mat1[i][j] = j + i;

    //Inicializamos la mat2
    for (i = 0; i < N; i++)
        for (j = 0; j < P; j++)
            mat2[i][j] = j + i;

    //Inicializamos la mat3
    for (i = 0; i < M; i++)
        for (j = 0; j < P; j++)
            mat3[i][j] = 0;

    #pragma omp parallel for shared(mat1,mat2,mat3) private(i,j,k,tid)
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            for (k = 0; k < N; k++) {
                tid=omp_get_thread_num();
                mat3[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
    }

    //Muestro matresultado
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            printf("%d ", mat3[i][j]);
        }
        printf("\n");
    }

    return 0;
}
