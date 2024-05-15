import esbuild from "esbuild";

const str = process.argv.find(arg => arg.startsWith("mode="));
const mode = str ? str.split("=")[1] : "development";

const config = {
	entryPoints: ["index.tsx"],
	bundle: true,
	outdir: "dist",
	loader: {
		".tsx": "tsx",
		".jpg": "file",
	},
	publicPath: "dist",
	jsx: "automatic",
	minify: mode === "production",
	define: {
		"process.env.NODE_ENV": `'${mode}'`,
	},
};

if (mode === "development") {
	const ctx = await esbuild.context(config);
	const {port} = await ctx.serve({ servedir: "./" });
	console.log(`Serving on http://localhost:${port}`);
	await ctx.watch();
	console.log("Watching for changes...");
} else {
	await esbuild.build(config);
}
