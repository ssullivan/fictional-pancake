/* Mix Masters: limits for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Keep numbers friendly for mental math. */
module.exports = {
  limits: {
    lang:    {dp: 0, nz: 2, max: 20},
    equiv:   {dp: 0, nz: 2, max: 30},
    dnl:     {dp: 2, nz: 3, max: 100},
    table:   {dp: 1, nz: 4, max: 1300},
    ppw:     {dp: 0, nz: 2, max: 120},
    compare: {dp: 2, nz: 3, max: 100},
  },
};
