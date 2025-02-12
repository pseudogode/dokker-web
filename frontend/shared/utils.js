export const parseJson = async (response) => {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    console.error(err, text);
    throw new Error(
      'Response is not in json format'
    );
  }
};
