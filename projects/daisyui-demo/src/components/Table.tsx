export const Table = () => (
  <div className="w-full">
    <div className="overflow-x-auto">
      <table className="table table-sm md:table-md lg:table-lg w-full">
        {/* head */}
        <thead>
          <tr>
            <th className="hidden sm:table-cell">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </label>
            </th>
            <th>姓名</th>
            <th className="hidden md:table-cell">职位</th>
            <th className="hidden lg:table-cell">喜爱颜色</th>
            <th className="w-16"></th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <th className="hidden sm:table-cell">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </label>
            </th>
            <td>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="avatar hidden sm:block">
                  <div className="mask mask-squircle h-8 w-8 md:h-12 md:w-12">
                    <img src="https://img.daisyui.com/images/profile/demo/2@94.webp" alt="Avatar" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base">Hart Hagerty</div>
                  <div className="text-xs md:text-sm opacity-50 hidden sm:block">United States</div>
                </div>
              </div>
            </td>
            <td className="hidden md:table-cell">
              <span className="hidden md:inline">Zemlak, Daniel and Leannon</span>
              <br className="hidden md:inline" />
              <span className="badge badge-ghost badge-sm">Desktop Support</span>
            </td>
            <td className="hidden lg:table-cell">Purple</td>
            <th>
              <button className="btn btn-ghost btn-xs">详情</button>
            </th>
          </tr>
          {/* row 2 */}
          <tr>
            <th className="hidden sm:table-cell">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </label>
            </th>
            <td>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="avatar hidden sm:block">
                  <div className="mask mask-squircle h-8 w-8 md:h-12 md:w-12">
                    <img src="https://img.daisyui.com/images/profile/demo/3@94.webp" alt="Avatar" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base">Brice Swyre</div>
                  <div className="text-xs md:text-sm opacity-50 hidden sm:block">China</div>
                </div>
              </div>
            </td>
            <td className="hidden md:table-cell">
              <span className="hidden md:inline">Carroll Group</span>
              <br className="hidden md:inline" />
              <span className="badge badge-ghost badge-sm">Tax Accountant</span>
            </td>
            <td className="hidden lg:table-cell">Red</td>
            <th>
              <button className="btn btn-ghost btn-xs">详情</button>
            </th>
          </tr>
          {/* row 3 */}
          <tr>
            <th className="hidden sm:table-cell">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </label>
            </th>
            <td>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="avatar hidden sm:block">
                  <div className="mask mask-squircle h-8 w-8 md:h-12 md:w-12">
                    <img src="https://img.daisyui.com/images/profile/demo/4@94.webp" alt="Avatar" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base">Marjy Ferencz</div>
                  <div className="text-xs md:text-sm opacity-50 hidden sm:block">Russia</div>
                </div>
              </div>
            </td>
            <td className="hidden md:table-cell">
              <span className="hidden md:inline">Rowe-Schoen</span>
              <br className="hidden md:inline" />
              <span className="badge badge-ghost badge-sm">Office Assistant</span>
            </td>
            <td className="hidden lg:table-cell">Crimson</td>
            <th>
              <button className="btn btn-ghost btn-xs">详情</button>
            </th>
          </tr>
          {/* row 4 */}
          <tr>
            <th className="hidden sm:table-cell">
              <label>
                <input type="checkbox" className="checkbox checkbox-sm" />
              </label>
            </th>
            <td>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="avatar hidden sm:block">
                  <div className="mask mask-squircle h-8 w-8 md:h-12 md:w-12">
                    <img src="https://img.daisyui.com/images/profile/demo/5@94.webp" alt="Avatar" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm md:text-base">Yancy Tear</div>
                  <div className="text-xs md:text-sm opacity-50 hidden sm:block">Brazil</div>
                </div>
              </div>
            </td>
            <td className="hidden md:table-cell">
              <span className="hidden md:inline">Wyman-Ledner</span>
              <br className="hidden md:inline" />
              <span className="badge badge-ghost badge-sm">Outreach Specialist</span>
            </td>
            <td className="hidden lg:table-cell">Indigo</td>
            <th>
              <button className="btn btn-ghost btn-xs">详情</button>
            </th>
          </tr>
        </tbody>
        {/* foot */}
        <tfoot className="hidden md:table-footer-group">
          <tr>
            <th className="hidden sm:table-cell"></th>
            <th>姓名</th>
            <th className="hidden md:table-cell">职位</th>
            <th className="hidden lg:table-cell">喜爱颜色</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
)
