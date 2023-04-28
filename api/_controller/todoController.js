const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");
const getTotal = async()=>{
  try{
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO}`;
    const [[{cnt}]]=await db.execute(query);
    return cnt;
  }catch(e){
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};
const getSelectOne = async(id)=>{
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO} WHERE id=?`;
    const values = [id];
    const [[{ cnt }]] = await db.execute(query, values);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};
const getList = async(req)=>{
  try{
    const lastId = parseInt(req.query.lastId)||0;
    const len = parseInt(req.query.len)||10;

    let where = "";
    if(lastId){
      where = `WHERE id < ${lastId}`;
    }
    const query = `SELECT * FROM ${TABLE.TODO} ${where} order by id desc limit 0, 
    ${len}`;
    const [rows] = await db.execute(query);
    return rows;
  }catch (e){
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};


const todoController = {

  create: async(req)=>{
    const {title, done} = req.body;
      if(isEmpty(title)||isEmpty(done)){
        return resData(STATUS.E100.result, STATUS.E100.resultDesc,
          currentTime());
      }

      try{
        const query = `INSERT ITO todo (title, done) VALUES (?,?)`;
        const values = [title, done];
        const [rows] = await db.execute(query, values);
        if(rows.affectedRows == 1){
          return resData(
            STATUS.S200.result,
            STATUS.S200.resultDesc,
            currentTime()
          );
        }
      } catch(e){
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, currentTime());
     }
  },

  list: async(req)=>{
    const totalCount = await getTotal();
    const list = await getList(req);
    if (totalCount > 0 && list.length) {
      return resData(
        STATUS.S200.result,
        STATUS.S200.resultDesc,
        moment().format('LT'),
        { totalCount, list }
      );
    }else{
      return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
    }
  },

  update: async(req)=>{
    const{id}=req.params;
    const{title, done}=req.body;
    if(isEmpty(id)||isEmpty(title)||isEmpty(done)){
      return resData(STATUS.E100.result, )
    }
    try {
      const query = `UPDATE ${TABLE.TODO} SET title =?, done=? WHERE id= ?`;
      const values = [title, done, id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  delete: async (req) => {
    const { id } = req.params;
    if (isEmpty(id)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }
    const cnt = await getSelectOne(id);
    try {
      if (!cnt) {
        return resData(
          STATUS.E100.result,
          STATUS.E100.resultDesc,
          moment().format('LT')
        );
      }
      const query = `DELETE FROM ${TABLE.TODO} WHERE id = ?;`;
      const values = [id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
    return rows;
  },

  reset: async(req)=>{
      try{
        const{title, done, len}=req.body;
        const query=`TRUNCATE TABLE ${TABLE.TODO}; 
        DELIMITER $$
        CREATE PROCEDURE add_function()
        BEGIN
	        DECLARE i INT DEFAULT 100; #
    	        WHILE (i <= len) DO
              INSERT ITO todo (title, done) VALUES (?,?);
          SET i = i + 1;
	        END WHILE;
        END $$
        DELIMITER ;
        CALL add_function();`;
        const values=[title, done];
        
        for(i=0; i<len; i++){
            
        }
        const [rows]=await db.execute(query, values);


        if (rows.affectedRows == 1) {
            return resData(
              STATUS.S200.result,
              STATUS.S200.resultDesc,
              currentTime()
            );
          }
        }

        
         catch (e) {
          console.log(e.message);
          return resData(STATUS.E300.result, STATUS.E300.resultDesc, currentTime());
        }
      },
}
module.exports = todoController;