export function formatDate(date) {
  const dateNew = new Date(date);
  return (
    <>
      {dateNew.getDate()}/{dateNew.getMonth() + 1}/{dateNew.getFullYear()}
      <br />
      {dateNew.getHours()}:{dateNew.getMinutes()}:{dateNew.getSeconds()}
    </>
  );
}
