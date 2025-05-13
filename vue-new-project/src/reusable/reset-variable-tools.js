export const handleResetNav = (e) => {
  const show_profile =
    e.currentTarget.getAttribute("id") === "profile_user" ? true : false;

  if (!show_profile) {
    profileRef.value.children[1].setAttribute("data-arrow", "down");
  }
};
