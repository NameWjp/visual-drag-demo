export default async function runAnimation(element, animations) {
  const play = (animation) => new Promise(resolve => {
    element.classList.add('animate__animated', `animate__${animation.value}`);

    const removeAnimation = () => {
      element.removeEventListener('animationend', removeAnimation);
      element.removeEventListener('animationcancel', removeAnimation);
      element.classList.remove('animate__animated', `animate__${animation.value}`);
      resolve();
    };

    element.addEventListener('animationend', removeAnimation);
    element.addEventListener('animationcancel', removeAnimation);
  });

  for (let i = 0; i < animations.length; i++) {
    await play(animations[i]);
  }
}
