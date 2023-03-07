import ca from "element-ui/src/locale/lang/ca";

export function parseSex(sex) {
  switch (sex) {
    case 1:
    case "1":
      return "男";
    case 2:
    case "2":
      return "女";
    default:
      return "未知"
  }
}

export function parseAge(birthday) {
  if(!birthday) return '未知';
  let birthYear = new Date(birthday).getFullYear();
  let birthMonth = new Date(birthday).getMonth()+1;
  let birthDay = new Date(birthday).getDate();

  let nowYear = new Date().getFullYear();
  let nowMonth = new Date().getMonth()+1;
  let nowDay = new Date().getDate();

  let diffYear = nowYear - birthYear;
  if(birthMonth < nowMonth){
    return diffYear>0?diffYear:1;
  }else if(birthMonth === nowMonth){
    if(birthDay > nowDay) {
      diffYear--;
      return diffYear>0?diffYear:1;
    }else {
      return diffYear>0?diffYear:1;
    }
  }else {
    diffYear--;
    return diffYear>0?diffYear:1;
  }
}


