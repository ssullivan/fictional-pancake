/* Blueprint Builders: limits for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Keep numbers friendly for mental math. */
module.exports = {
  limits: {
    para:  {dp: 0, nz: 2, max: 70},
    tri:   {dp: 1, nz: 3, max: 40},
    poly:  {dp: 0, nz: 2, max: 80},
    net:   {dp: 0, nz: 3, max: 160},
    cube:  {dp: 0, nz: 3, max: 500},
    frame: {dp: 1, nz: 3, max: 80},
  },
};
