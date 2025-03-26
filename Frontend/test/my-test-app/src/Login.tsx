import React, { useState } from "react";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const url = `http://localhost:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2)); // 응답을 JSON 문자열로 저장
    } catch (error) {
      setResponse("로그인 실패: " + error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded mb-2"
      />
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">
        Login
      </button>
      {response && (
        <pre className="mt-4 p-2 bg-gray-200 rounded">{response}</pre>
      )}
    </div>
  );
};

export default Login;
