<h1 align="center"> ¿Cómo contribuir? </h1> <br>
<p align="center">
          <a 		href="../README.md">
  <img alt="Inicio" title="Inicio" src="../imagenes/boton-inicio.png" width="140">
  </a>
      <a 		href="../universidad">
  <img alt="Universidad" title="Universidad" src="../imagenes/boton-universidad.png" width="140">
  </a>
        <a 		href=CONTRIBUIR.md">
  <img alt="Contribuir" title="Contribuir" src="../imagenes/boton-contribuir.png" width="140">
  </a>
</p>
<p align="center">
    <img alt="Contribuir" title="Contribuir" src="../imagenes/contribuir.png" width="450">
</p>






¿Quieres contribuir y no sabes por dónde y cómo hacerlo? ¡No debes preocuparte! Hay todo tipo de formas de involucrarse con el proyecto y unos pocos consejos te ayudarán a sacar el máximo provecho. 



## ¿En qué contribuir?

Visita nuestro [tablón de tareas](https://github.com/Stuja/stuja/projects), es el lugar perfecto para empezar con algo. Si falta algo, añádelo.  

### ¿Te gusta diseñar?

- Reestructura los diseños para mejorar la usabilidad del proyecto
- Reúne una guía de estilos para ayudar al proyecto a tener un diseño con consistencia visual

### ¿Te gusta escribir?

- Escribe y mejora la documentación del proyecto
- Escribe una traducción de la documentación del proyecto

### ¿Te gusta programar?

- Comparte tu código para que de ese modo los demás puedan aprender de él
- Pregunta si puedes ayudar a escribir alguna nueva funcionalidad

### ¿Te gusta ayudar a las personas?

- Responde preguntas a las personas en los problemas abiertos
- Ayuda a moderar los foros de discusión o canales de conversación

### ¿Te gusta ayudar a otros a programar?

- Revisa el código que otras personas presentan
- Escribe tutoriales sobre cómo puede resolverse una práctica de clase
- Ofrécete como tutor de otro estudiante



## Pasos para colaborar

1. **Haz un Fork** del proyecto. 

   En la esquina superior izquierda de la página encontrarás un botón, haz click en **Fork**.

   [**¿Qué es un fork?**](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) Un fork es una copia de un repositorio. Haciendo un fork de un repositorio te permite experimentar libremente con los cambios sin afectar el proyecto original.

2. En GitHub, **navega hacia el Fork** que se te ha generado. 

3. **Clona el proyecto**. 

   ```shell
   git clone https://github.com/YOUR-USERNAME/stuja
   ```

4. **Crea una rama**, protegiendo de ese modo la rama `master`. 

   ```bash
   git checkout -b "nombre-de-tu-rama"
   ```

   Puedes leer más información sobre el porqué de este paso en: 

   * [Best practices for protected branches](https://github.community/t5/Support-Protips/Best-practices-for-protected-branches/ba-p/10224#)
   * [Protecting the master branch](https://cityofaustin.github.io/ctm-dev-workflow/protected-branches.html)

5. **Aporta tus mejoras** al proyecto. ¡Ah!, y no olvides incluirte en la sección de *Contribuidores*: `doc/CONTRIBUIR.md`, `universidad/README.md` y `README.md`.

6. **Guarda** los cambios. 

   ```bash
   git add . 
   
   git commit -m "Descripción del cambio que has realizado"
   ```

7. **Sube los cambios** a GitHub.

   ```bash
   git push origin "nombre-de-tu-rama"
   ```

8. En GitHub, **haz un pull request** haciendo click en el botón *Compare & pull request*.

9. En la nueva ventana, **describe los cambios que has añadido** y señala por qué son importantes.  

10. **Envia el pull request** haciendo click en *Create pull request*.



## Manténte al día 

Deberías configurar tu repositorio local para que apunte al repositorio original de Stuja `https://github.com/Stuja/stuja`, para sincronizar cualquier cambio que se realicen en GitHub. 

De este modo, siempre tendrás la última actualización de Stuja en tu repositorio local. 

#### Pasos a seguir

1. **Lista** tus repositorios remotos

   ```bash
   git remote -v
   ```

   ```bash
   origin	https://github.com/tu-usuario/stuja.git (fetch)
   origin	https://github.com/tu-usuario/stuja.git (push)
   ```

2. **Crea** un nuevo repositorio remoto

   ```
   git remote add upstream https://github.com/Stuja/stuja.git
   ```

   Ahora upstream apuntará al repositorio original de GitHub de Stuja. 

3. **Verifica** tus repositorios remotos

   ```bash
   git remote -v
   ```

   ```bash
   origin	https://github.com/tu-usuario/stuja.git (fetch)
   origin	https://github.com/tu-usuario/stuja.git (push)
   upstream	https://github.com/Stuja/stuja.git (fetch)
   upstream	https://github.com/Stuja/stuja.git (push)
   ```

4. **Actualiza** tu rama master

   ```bash
   git pull upstream master
   ```

   ```bash
   Desde https://github.com/Stuja/stuja
    * branch            master     -> FETCH_HEAD
   Ya está actualizado.
   ```



### Dudas 🙋

¿Has tenido algún problema con los pasos anteriores? No te preocupes, aquí te facilitamos ayudas para que te sea más fácil: 

- [Cómo crear un Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo). Un Fork es una copia de un proyecto. Los Forks te permite experimentar libremente con cambios sin afectar al proyecto original. 
- [Cómo clonar un proyecto](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)

¿Sigues con dudas? Accede a nuestro [grupo de Telegram](https://t.me/stujaGitHub) y pregunta. Siempre hay miembros que te podrán ayudar mejor😉 . 



## Házte con un mentor

En la sección de [Issues](https://github.com/Stuja/stuja/issues) podrás ver que muchas tareas están por hacer y que algunas tienen la etiqueta `E-mentor`. En los issues etiquetados con `E-mentor`, un colaborador que tiene experiencia con el proyecto se ha ofrecido como voluntario para guiarte a través de la resolución del issue. 

¡Es una idea maravillosa!

Y eso no es todo. Si tienes una idea y vas a necesitar un poco de ayuda en el proceso, házte con un mentor haciendo lo siguiente: 

1. Ve a la **sección de [Issues](https://github.com/Stuja/stuja/issues)**.

2. **Crea un nuevo issue** pulsando en `New issue`

   ![](http://i.imgur.com/Eg3QiKG.png)

3. **Añade un título** y una descripción a tu idea. 

   <img src="http://i.imgur.com/TNmwEPz.png" style="zoom: 80%;" />

4. **Asígnate la tarea**.

   <img src="http://i.imgur.com/Tmvkhyx.png" style="zoom: 67%;" />

5. **Añade la etiqueta** `E-mentor`. 

   <img src="http://i.imgur.com/8dxmJwK.png" style="zoom: 67%;" />

¡Ya lo tienes! Un colaborador se pondrá en contacto contigo a través del chat del issue y podréis llevar a cabo esa idea que tienes en mente 😉 . 



## Alternativas de colabaración

Si quieres aportar algo al repositorio pero aún no te has animado a hacerlo directamente, hay otra manera en la que puedes colaborar: 

Accediendo a nuestro [grupo de Telegram](https://t.me/stujaGitHub) y enviándonos tu aportación. Siempre hay miembros que podrán hacerlo por ti. Además, seguirás teniendo el reconocimiento en la sección de contribuidores. 



## Guía de estilo 🦋

Para una visualización homogénea del proyecto, lee [nuestra guía de estilo](GUIA-DE-ESTILO.md). Si ves algo que se pueda mejorar, no dudes en aportar tu mejora. 

Si la asignatura sobre la que vas a añadir contenido aún no tiene un directorio creado, créalo y usa [nuestro template](../plantillas/README-PARA-ASIGNATURA.md) para el `README.md` de dicha asignatura. 

Igualmente si vas a añadir soluciones sobre las prácticas, usa el [template](../plantillas/README-PARA-PRÁCTICAS.md) y sitúalo dentro de la carpeta `universidad/asignatura/NOMBRE-DE-LA-ASIGNATURA/Prácticas`.

Basta con rellenar los espacios entre corchetes `[]` con la información correspondiente. 



## ¿Cómo escribir documentación?

La documentación esta escrita en formato [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet), por su simplicidad, rapidez y portabilidad. 

Existen muchos editores, y os invito que compartáis aquellos que vosotros utelicéis. Aquí algunos: 

- [Typora](https://www.typora.io/). Para instalar y disponible para la mayoría de las plataformas. 
- [Stackedit](https://stackedit.io/). Editor potente y online. Su interfaz gráfica hace muy sencillo editar los documentos.



## Contribuidores ✍️

Todos aquellos que ayudaron a levantar el proyecto.


| <img alt="manuelalferez" src="https://avatars1.githubusercontent.com/u/38152841?s=400&amp" width="50"> | <img alt="Delunado" src="https://avatars0.githubusercontent.com/u/11133623?s=400&v=4" width="50"> | <img alt="rgomez96" src="https://avatars3.githubusercontent.com/u/50320963?s=400&v=4" width="50"> | <img alt="Davavico22" src="https://avatars0.githubusercontent.com/u/57295165?s=400&u=e12594f20ed0f40e56be958eb12622e04e4f1854&v=4" width="50"> |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [manuelalferez](https://github.com/manuelalferez)            | [Delunado](https://github.com/Delunado)                      | [rgomez96](https://github.com/rgomez96)                      | [Davavico22](https://github.com/Davavico22)|
