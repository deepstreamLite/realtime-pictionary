const ds = require('../js/services/ds')


const record = ds.record.getRecord('state').whenReady((record) => {
  const WORD_LIST = [
    "aircraft","America","backbone","baseball","battery","bicycle","blading",
      "bomb","bowtie","cake","circus","coal","computer","cowboy","deep","dominoes",
      "door","electricity","frog","garbage","gingerbread-man","half","hockey","horse",
      "iPad","key","lawnmower","light","bulb","lightsaber","mailman","mattress","music",
      "nature","outside","palace","park","password","photograph","pinwheel","pirate",
      "platypus","queen","roller","round","shallow","skate","ski","song","spare","spring",
      "state","teapot","thief","toast","treasure","trip","wax","whisk","whistle"
    ];
  record.set({})
})
