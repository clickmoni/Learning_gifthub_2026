export async function onRequestGet() {
  return Response.json({
    success: true,
    message: "API is working"
  });
}
