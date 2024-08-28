import style from './Spinner.module.css';

export default function Spinner({ height_class }) {
  return (
    <div className={`flex justify-center items-center ${height_class}`}>
      <span className={style.loader}></span>
    </div>
  );
}
