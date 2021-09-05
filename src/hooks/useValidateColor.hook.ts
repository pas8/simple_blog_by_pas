import { getThemePropertyies } from './../store/modules/App/selectors';
import { useSelector } from "react-redux";
import { colord } from 'colord';

export const useValidateColor = (color:string):string => {

  const themePropertyies = useSelector(getThemePropertyies);

return   colord(themePropertyies.background).isDark() && colord(color).isDark()
              ? colord(color).invert().toHex()
              : color
}