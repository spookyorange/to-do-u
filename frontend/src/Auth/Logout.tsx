function Logout() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={() => {
        logout();
      }}
      className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      Logout
    </button>
  );
}

export default Logout;
