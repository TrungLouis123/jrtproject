module.exports.config = {
    name: "chongcuopbox",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "D-Jukie",
    description: "Ngăn chặn việc thay đổi admin",
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { logMessageType, logMessageData, senderID } = event;
 	let data = (await Threads.getData(event.threadID)).data
 	if (data.guard == false) return;
    if (data.guard == true ) {
        switch (logMessageType) {
          case "log:thread-admins": {
            if (logMessageData.ADMIN_EVENT == "add_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false)
                function editAdminsCallback(err) {
                  if (err) return api.sendMessage("[⚜️]➜ Bot đã gỡ quản trị viên của bạn!", event.threadID, event.messageID);
                    return api.sendMessage(`[⚜️]➜ Nhóm của bạn đang bật chế độ chống cướp nhóm, vui lòng tắt trước khi thêm hoặc gỡ quản trị viên nhóm!`, event.threadID, event.messageID);
                }
              }
            }
            else if (logMessageData.ADMIN_EVENT == "remove_admin") {
              if(event.author == api.getCurrentUserID()) return
              if(logMessageData.TARGET_ID == api.getCurrentUserID()) return
              else {
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback)
                api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true)
                function editAdminsCallback(err) {
                if (err) return api.sendMessage("[⚜️]➜ Bot đã thêm bạn lên lại quản trị viên!", event.threadID, event.messageID);
                return api.sendMessage(`[⚜️]➜ Nhóm của bạn đang bật chế độ chống cướp nhóm, vui lòng tắt trước khi thêm hoặc gỡ quản trị viên nhóm!`, event.threadID, event.messageID);
              }
            }
          }
        }
      }
    }
}
