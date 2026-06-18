
// Basic Edit Profile Logic
window.editProfile = function () {
    const newName = prompt("Enter new name:", state.user.name);
    const newEmail = prompt("Enter new email:", state.user.email);

    if (newName && newEmail) {
        state.user.name = newName;
        state.user.email = newEmail;

        // Update Avatar URL to match new name
        state.user.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=FF8C00&color=fff`;

        renderProfile();
        alert("Profile Updated Successfully! ✅");
    }
}
