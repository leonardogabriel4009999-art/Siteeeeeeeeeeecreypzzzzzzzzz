import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", message: "API InfoPulsebot ativa (localhost)" });
});

app.post("/api/generate-result", (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ error: "Nenhum dado recebido." });

    const encoded = Buffer.from(
      unescape(encodeURIComponent(data))
    ).toString("base64");

    const resultUrl = `http://localhost:3000/result.html?data=${encoded}`;

    return res.json({
      status: "ok",
      message: "Link gerado com sucesso!",
      url: resultUrl,
    });
  } catch (err) {
    console.error("Erro ao gerar resultado:", err);
    res.status(500).json({ error: "Falha interna ao gerar resultado." });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor InfoPulsebot rodando em http://localhost:${PORT}`);
});
